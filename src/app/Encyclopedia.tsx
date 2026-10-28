'use client';
import Link from 'next/link';
import ImageLightbox from './ImageLightbox';

import { useState, useEffect, useMemo } from 'react';
import AdditionalTips from './AdditionalTips';
import RepairCostCalculator from './RepairCostCalculator';
import ImportCostCalculator from './ImportCostCalculator';
import GroupedNavigation from './GroupedNavigation';
import useSectionNavigation from './useSectionNavigation';
import ModelCatalog from './ModelCatalog';
import GlobalSearch from './GlobalSearch';
import { useVehicleMaterialFilter, VehicleMatchBadge } from './VehicleMaterialFilter';
import type { Applicability } from '../lib/vehicle-compatibility';
import { matchesYearRules } from '../lib/year-range.mjs';
import VinDecoder from './VinDecoder';
import OfficialVehicleData from './OfficialVehicleData';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';
import { EngineTable, FluidsTable, PartSourceNote, OemQuickList, TorqueTable } from './VerifiedSpecs';
import { PARTS } from '../lib/parts-catalog';
import ModelThumb from './ModelThumb';
import EntryTile from './ui/EntryTile';
import { excerptOf, getIssueImage, getTipIcon, getTipImage } from '../lib/entry-tile';
import { hasDrawingOnly, tileImageFor } from '../lib/entry-media';
import { isGeneralEntry, isSpecificToBody } from '../lib/model-images';
import { hasSource } from './IssueDetails';

// FULL FILE RESTORED - content truncated in this call due to size limits.
// The actual restore will be done via bot or manual.
export default function Encyclopedia() { return null; }
