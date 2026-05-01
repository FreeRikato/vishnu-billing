import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import { scale } from '@/utils/responsive'

export const invoiceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    paddingTop: scale(60),
    paddingBottom: scale(16),
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  searchBar: {
    width: '90%',
    marginTop: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    padding: scale(10),
    color: Colors.text,
  },
  chipsContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(10),
  },
  chipsContent: {
    gap: scale(10),
  },
  chip: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(16),
    backgroundColor: '#1C1C1E',
  },
  chipActive: {
    backgroundColor: '#13EC6A',
  },
  chipText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: scale(14),
  },
  chipTextActive: {
    color: '#000000',
  },
  list: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: scale(80),
  },
  invoiceCard: {
    backgroundColor: Colors.card,
    borderRadius: scale(8),
    padding: scale(16),
    marginBottom: scale(12),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  invoiceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  invoiceNo: {
    fontSize: scale(16),
    fontWeight: '700',
    color: Colors.text,
  },
  statusPill: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(12),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    fontSize: scale(12),
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  invoiceDetail: {
    fontSize: scale(14),
    color: Colors.textSecondary,
    marginBottom: scale(4),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(40),
  },
  emptyStateText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: Colors.text,
    marginBottom: scale(8),
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: scale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
})
