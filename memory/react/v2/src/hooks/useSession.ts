import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { accountsService, UserSessionDto } from '../api';

interface UseSessionProps {
  accountName: string;
  userId: string;
  timeLimit: number; // in minutes
  onTimeWarning: (remainingMinutes: number) => void; // called at 5 min and 1 min remaining
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
  const [hasShown1MinWarning, setHasShown1MinWarning] = useState(false);
  const isMountedRef = useRef(false);
  const isInitializingRef = useRef(false);
  const timeLimitRef = useRef(timeLimit);

  // Use refs for callbacks to avoid re-creating interval
  const onTimeWarningRef = useRef(onTimeWarning);
  const onTimeExpiredRef = useRef(onTimeExpired);

  useEffect(() => {
    onTimeWarningRef.current = onTimeWarning;
    onTimeExpiredRef.current = onTimeExpired;
    timeLimitRef.current = timeLimit;
  }, [onTimeWarning, onTimeExpired, timeLimit]);

  // Initialize or get today's session
  const initializeSession = useCallback(async () => {
    // Prevent concurrent initialization
    if (isInitializingRef.current) {
      console.log('Already initializing session, skipping...');
      return;
    }

    try {
      isInitializingRef.current = true;
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

      // Calculate effective time limit with extensions
      const effectiveTimeLimit = timeLimitRef.current + (todaySession.extendedMinutes || 0);

      // Check if already exceeded on re-entry
      if (todaySession.totalMinutes >= effectiveTimeLimit) {
        console.log('Time limit already exceeded on session initialization');
        // Use a separate effect to handle expiration to avoid setState during render
      } else if (effectiveTimeLimit - todaySession.totalMinutes <= 5) {
        // If 5 minutes or less remaining, show warning immediately
        setHasShownWarning(true);
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  }, [accountName, userId]);

  // Start session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Mark as mounted in a separate effect to ensure it runs after initial render
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Handle time expiration check in a separate effect (only after initial mount)
  useEffect(() => {
    if (!session || loading) return;

    // Don't run on first render
    if (!isMountedRef.current) return;

    const effectiveTimeLimit = timeLimitRef.current + (session.extendedMinutes || 0);

    if (session.totalMinutes >= effectiveTimeLimit) {
      // Use setTimeout to ensure callback runs after all renders complete
      const timer = setTimeout(() => {
        onTimeExpiredRef.current();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [session, loading]);

  // Track elapsed time every minute and sync with backend
  useEffect(() => {
    if (!session || loading) return;

    const interval = setInterval(async () => {
      setElapsedMinutes((prev) => {
        const newElapsed = prev + 1;

        // Sync with backend
        accountsService.updateSessionTime(session.id, newElapsed).catch((error) => {
          console.error('Failed to update session time:', error);
        });

        // Calculate effective time limit with extensions
        const effectiveTimeLimit = timeLimitRef.current + (session.extendedMinutes || 0);

        // Check for warnings
        const remainingMinutes = effectiveTimeLimit - newElapsed;

        if (remainingMinutes === 5 && !hasShownWarning) {
          console.log('5 minutes remaining!');
          setHasShownWarning(true);
          onTimeWarningRef.current(5);
        }

        if (remainingMinutes === 1 && !hasShown1MinWarning) {
          console.log('1 minute remaining!');
          setHasShown1MinWarning(true);
          onTimeWarningRef.current(1);
        }

        // Check if time exceeded
        if (newElapsed >= effectiveTimeLimit) {
          console.log('Time limit exceeded!');
          onTimeExpiredRef.current();
        }

        return newElapsed;
      });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [session, loading, hasShownWarning, hasShown1MinWarning]);

  const remainingMinutes = useMemo(() => {
    const effectiveTimeLimit = timeLimitRef.current + (session?.extendedMinutes || 0);
    return Math.max(0, effectiveTimeLimit - elapsedMinutes);
  }, [elapsedMinutes, session?.extendedMinutes]);

  const isExpired = useMemo(() => {
    const effectiveTimeLimit = timeLimitRef.current + (session?.extendedMinutes || 0);
    return elapsedMinutes >= effectiveTimeLimit;
  }, [elapsedMinutes, session?.extendedMinutes]);

  return {
    session,
    loading,
    elapsedMinutes,
    remainingMinutes,
    isExpired,
    refreshSession: initializeSession,
  };
};
