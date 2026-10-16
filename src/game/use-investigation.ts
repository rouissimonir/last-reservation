import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Action, freshProgress, investigationReducer, Progress } from './engine';
import { createSaveQueue, loadProgress, LoadResult } from './storage';
import { CASE_ID } from './case';
import { caseEvents } from './case-events';
import { track } from '../analytics/analytics';

// The case screen is keyed by caseId, so each hook owns one case for its lifetime.
export function useInvestigation(caseId = CASE_ID) {
  const [progress, setProgress] = useState(() => freshProgress(caseId));
  const current = useRef(progress);
  const [status, setStatus] = useState<'loading' | 'ready' | 'invalid' | 'unavailable'>('loading');
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [volatile, setVolatile] = useState(false);
  const writable = useRef(false);
  const write = useRef(createSaveQueue(AsyncStorage, caseId));
  const revision = useRef(0);
  const loadRevision = useRef(0);
  const persist = useCallback((p: Progress) => {
    if (!writable.current) return;
    const ticket = ++revision.current;
    setSaving(true);
    void write.current(p).then(() => {
      if (ticket === revision.current) { setSaveError(false); setSaving(false); }
    }).catch(() => {
      if (ticket === revision.current) { setSaveError(true); setSaving(false); }
    });
  }, []);
  const acceptLoad = useCallback((loaded: LoadResult) => {
    if (loaded.kind === 'empty' || loaded.kind === 'loaded') {
      current.current = loaded.progress;
      setProgress(loaded.progress);
      setVolatile(false);
      writable.current = true;
      setStatus('ready');
    } else setStatus(loaded.kind);
  }, []);
  const reload = useCallback(() => {
    const ticket = ++loadRevision.current;
    setStatus('loading');
    writable.current = false;
    return loadProgress(AsyncStorage, caseId).then(loaded => {
      if (ticket === loadRevision.current) acceptLoad(loaded);
    });
  }, [acceptLoad, caseId]);
  useEffect(() => {
    const ticket = ++loadRevision.current;
    let cancelled = false;
    void loadProgress(AsyncStorage, caseId).then(loaded => {
      if (!cancelled && ticket === loadRevision.current) acceptLoad(loaded);
    });
    return () => { cancelled = true; };
  }, [acceptLoad, caseId]);
  const dispatch = useCallback((action: Action) => {
    // Update the ref synchronously so rapid events always see the latest domain state.
    const next = investigationReducer(current.current, action);
    if (next !== current.current) {
      caseEvents(current.current, next).forEach(track);
      current.current = next;
      setProgress(next);
      persist(next);
    }
    return next;
  }, [persist]);
  const reset = useCallback(() => {
    ++loadRevision.current;
    const next = freshProgress(caseId);
    current.current = next;
    setProgress(next);
    writable.current = true;
    setVolatile(false);
    setStatus('ready');
    persist(next);
  }, [persist, caseId]);
  const playUnsaved = useCallback(() => {
    ++loadRevision.current;
    current.current = freshProgress(caseId);
    setProgress(current.current);
    writable.current = false;
    setVolatile(true);
    setStatus('ready');
  }, [caseId]);
  return { progress, status, saving, saveError, volatile, dispatch, reset,
    reload, playUnsaved,
    retrySave: () => persist(current.current) };
}
