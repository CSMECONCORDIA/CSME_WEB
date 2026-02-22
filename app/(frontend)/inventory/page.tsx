import { InventoryDashboard } from './InventoryDashboard'

export const metadata = {
  title: 'Inventory | CSME Concordia',
  description: 'CSME lab inventory checkout system. Browse available equipment and tools.',
}

export default function InventoryPage() {
  return <InventoryDashboard />
}
