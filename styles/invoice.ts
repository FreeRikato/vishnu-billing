import { Colors } from '@/constants/colors'
import { StyleSheet } from 'react-native'
import { scale } from '@/utils/responsive'
import { commonStyles } from './common'

export const invoiceStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    gap: scale(6),
    paddingBottom: scale(12),
  },
  title: commonStyles.screenTitle,
  text: commonStyles.screenText,
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: scale(10),
    paddingHorizontal: scale(12),
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginTop: scale(10),
  },
  searchInput: {
    flex: 1,
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    color: Colors.text,
  },
  chipsRow: {
    width: '100%',
    marginTop: scale(12),
    marginBottom: scale(8),
  },
  chipsContent: {
    paddingHorizontal: scale(2),
    gap: scale(10),
  },
  chip: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(8),
    borderRadius: scale(999),
    backgroundColor: '#1C1C1E',
  },
  chipActive: {
    backgroundColor: '#13EC6A',
  },
  chipText: {
    color: Colors.text,
    fontSize: scale(13),
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#000000',
  },
  list: {
    flex: 1,
    width: '100%',
    marginTop: scale(6),
  },
  invoiceItem: {
    backgroundColor: Colors.card,
    borderRadius: scale(12),
    padding: scale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: scale(10),
  },
  invoiceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  invoiceId: {
    color: Colors.text,
    fontSize: scale(14),
    fontWeight: '700',
  },
  invoiceStatus: {
    color: Colors.textSecondary,
    fontSize: scale(12),
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  invoiceMeta: {
    color: Colors.textSecondary,
    fontSize: scale(12),
    marginTop: scale(2),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
  },
  emptyStateText: {
    color: Colors.textSecondary,
    marginTop: scale(10),
  },
})
