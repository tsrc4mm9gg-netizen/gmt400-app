RESTORE_FROM_BASE_AND_INTEGRATE

1. Przywróć pełną zawartość pliku z refs/heads/fix/a11y-accordion-headings:src/app/moj-samochod/MaintenanceReminders.tsx.
2. Dodaj import:
import { useServiceHistory } from '@/lib/service-history-store';
3. Zmień sygnaturę komponentu:
export default function MaintenanceReminders({ vehicleId }: { vehicleId: string }) {
4. W komponencie dodaj:
const { addRecord } = useServiceHistory(vehicleId);
5. W markDone, bezpośrednio po pomyślnym localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)), dodaj:
addRecord({ title: reminder.name, date: lastDate, mileageKm: km, notes: 'Zapis automatyczny z przypomnienia' });
6. Nie usuwaj żadnej istniejącej funkcjonalności.