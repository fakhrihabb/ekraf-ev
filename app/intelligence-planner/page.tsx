import { Metadata } from 'next';
import IntelligencePlannerClient from '../components/intelligence-planner/IntelligencePlannerClient';

export const metadata: Metadata = {
    title: 'Intelligence Planner - SIVANA',
    description: 'Analisis lokasi SPKLU dan SPBKLU dengan AI dan data spasial',
};

export default function IntelligencePlannerPage() {
    return <IntelligencePlannerClient />;
}

