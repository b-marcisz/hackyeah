import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { accountsService, UserSessionDto } from '../api';

interface UseSessionProps {
  accountName: string;
  userId: string;
  timeLimit: number; // in minutes
  onTimeWarning: () => void; // 5 minutes remaining
  onTimeExpired: () => void; // time limit exceeded
}

export const useSession = ({
  accountName,
  userId,
  timeLimit,
  onTimeWarning,
  onTimeExpired,
}: UseSessionProps) => {
  const [session, setSession] = useState<UserSessionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // Use refs for callbacks to avoid re-creating interval
  const onTimeWarningRef = useRef(onTimeWarning);
  const onTimeExpiredRef = useRef(onTimeExpired);

  useEffect(() => {
    onTimeWarningRef.current = onTimeWarning;
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeWarning, onTimeExpired]);

  // Initialize or get today's session
  const initializeSession = useCallback(async () => {
    try {
      setLoading(true);

      // Check if session already exists for today
      let todaySession = await accountsService.getTodaySession(accountName, userId);

      if (!todaySession) {
        // Create new session
        todaySession = await accountsService.createSession(accountName, userId);
        console.log('New session created:', todaySession);
      } else {
        console.log('Existing session found:', todaySession);
      }

      setSession(todaySession);
      setElapsedMinutes(todaySession.totalMinutes || 0);

      // Check if already exceeded on re-entry
      if (todaySession.totalMinutes >= timeLimit) {
        console.log('Time limit already exceeded on session initialization');
        setTimeout(() => {
          onTimeExpiredRef.current();
        }, 500); // Small delay to ensure UI is ready
      } else if (timeLimit - todaySession.totalMinutes <= 5) {
        // If 5 minutes or less remaining, show warning immediately
        setHasShownWarning(true);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    } finally {
      setLoading(false);
    }
  }, [accountName, userId, timeLimit]);

  // Start session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Track elapsed time every minute
  useEffect(() => {
    if (!session || loading) return;

    const interval = setInterval(() => {
      setElapsedMinutes((prev) => {
        const newElapsed = prev + 1;

        // Check for 5-minute warning
        const remainingMinutes = timeLimit - newElapsed;
        if (remainingMinutes === 5 && !hasShownWarning) {
          console.log('5 minutes remaining!');
          setHasShownWarning(true);
          onTimeWarningRef.current();
        }

        // Check if time exceeded
        if (newElapsed >= timeLimit) {
          console.log('Time limit exceeded!');
          onTimeExpiredRef.current();
        }

        return newElapsed;
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [session, loading, timeLimit, hasShownWarning]);

  const remainingMinutes = useMemo(
    () => Math.max(0, timeLimit - elapsedMinutes),
    [timeLimit, elapsedMinutes]
  );

  return {
    session,
    loading,
    elapsedMinutes,
    remainingMinutes,
    isExpired: elapsedMinutes >= timeLimit,
    refreshSession: initializeSession,
  };
};
