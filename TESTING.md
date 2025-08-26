# Testing Guide

## Unit Tests

Run unit tests with:

```bash
npm test
```

## Manual E2E Testing

### Inline Image Rendering Test

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to your tenant**: `http://localhost:3001/o/line-lead-dev`

3. **Test inline image rendering**:

   - Ask: "Show me an image of my Taylor 602C"
   - Expected result: At least one inline `<img>` should render **above** the assistant's summary text

4. **Verify media streaming**:

   - Open browser DevTools → Network tab
   - Look for successful calls to `/api/ragie/stream?url=...` returning 200 with `content-type: image/*`

5. **Test non-image files**:
   - Ask for video/audio content
   - Expected result: Non-images should render as downloadable chips below the text, not inline

### Middleware Hardening Test

1. **Test healthz endpoint**:

   ```bash
   curl http://localhost:3001/api/healthz
   ```

   - Should return 200 without middleware errors

2. **Test cold start**:
   - Restart the dev server
   - Navigate to the app immediately
   - Should not see `MIDDLEWARE_INVOCATION_FAILED` errors

## Acceptance Criteria

- ✅ No `MIDDLEWARE_INVOCATION_FAILED` on first hit or cold start
- ✅ For image results, at least one inline `<img>` is visible **before** the short summary
- ✅ Non-images presented as downloadable chips
- ✅ Streaming visible (text grows; images can appear mid-turn)
- ✅ Unit tests pass
