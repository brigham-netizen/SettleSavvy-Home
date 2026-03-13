# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SettleSavvy** is a "Utility Onboarding Calculator" — a Next.js web app where users enter a US address and receive a comprehensive report of local utility providers, estimated monthly costs, historical price trends, and direct service-start links.

## Tech Stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Geocoding**: Google Maps API or Smarty (address normalization → County/City/Zip)
- **Search**: Tavily or Serper API (dynamic discovery of municipal utility URLs by city/zip)
- **Internet availability**: FCC Broadband Map API or BroadbandNow
- **Energy pricing**: EIA (Energy Information Administration) API for state-level historical data

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # TypeScript check (tsc --noEmit)
```

## Architecture

### Data Flow
1. User submits an address → geocoding API normalizes it and extracts city/county/zip/state
2. Parallel API calls fetch: electricity/gas (EIA), internet (FCC Broadband), and municipal utilities (Search API)
3. Results are aggregated into a structured report and returned to the frontend

### Key Concepts
- **Confirmed vs. Estimated**: UI must distinguish between providers confirmed via direct API/lookup vs. estimated from regional averages
- **No persistent address storage**: Address data is session-only; nothing written to a database
- **Server-side API calls**: All third-party API keys must stay on the server (Next.js Route Handlers or Server Actions)

### Directory Structure (planned)
```
src/
  app/                  # Next.js App Router pages and layouts
  components/           # Reusable UI components
  lib/
    geocoding.ts        # Address normalization (Google Maps / Smarty)
    eia.ts              # EIA energy pricing API client
    broadband.ts        # FCC Broadband Map API client
    search.ts           # Tavily/Serper search for municipal utility URLs
    aggregator.ts       # Combines all API results into unified report
  types/                # Shared TypeScript types/interfaces
```

### Utility Categories
The report covers: Electricity, Gas, Water, Sewer, Trash, Internet/Phone

Each utility entry should include: provider name, estimated monthly cost, confidence level (confirmed/estimated), and a direct "Start Service" action link.
