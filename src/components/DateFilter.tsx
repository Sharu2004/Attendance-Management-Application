import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../theme/theme';
import { getRelativeDateISO, formatDisplayDate } from '../utils/dateUtils';

export type DatePreset = 'all' | 'today' | 'yesterday' | 'week' | 'custom';

interface DateFilterProps {
  selectedPreset: DatePreset;
  customDate?: string;
  onSelectPreset: (preset: DatePreset, customDate?: string) => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  selectedPreset,
  customDate,
  onSelectPreset,
  onClearFilters,
  hasActiveFilters = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputDate, setInputDate] = useState(customDate || getRelativeDateISO(0));

  const presets: { id: DatePreset; label: string }[] = [
    { id: 'all', label: 'All Dates' },
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'Past 7 Days' },
    { id: 'custom', label: customDate ? formatDisplayDate(customDate) : 'Custom Date' },
  ];

  const handlePresetPress = (preset: DatePreset) => {
    if (preset === 'custom') {
      setModalVisible(true);
    } else {
      onSelectPreset(preset, undefined);
    }
  };

  const applyCustomDate = () => {
    setModalVisible(false);
    onSelectPreset('custom', inputDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {presets.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                testID={`date-filter-${p.id}`}
                activeOpacity={0.7}
                onPress={() => handlePresetPress(p.id)}
                style={[
                  styles.chip,
                  isSelected && styles.selectedChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.selectedChipText,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {hasActiveFilters && onClearFilters && (
          <TouchableOpacity
            testID="clear-all-filters-button"
            onPress={onClearFilters}
            style={styles.clearButton}
          >
            <Ionicons name="reload-outline" size={14} color={colors.accent} />
            <Text style={styles.clearText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Custom Date Modal Dialog */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Custom Date</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter a calendar date in YYYY-MM-DD format:
            </Text>

            <TextInput
              testID="custom-date-input"
              style={styles.dateInput}
              value={inputDate}
              onChangeText={setInputDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />

            <View style={styles.quickDateRow}>
              {[-2, -3, -4].map((offset) => {
                const dateVal = getRelativeDateISO(offset);
                return (
                  <TouchableOpacity
                    key={offset}
                    style={styles.quickDateChip}
                    onPress={() => setInputDate(dateVal)}
                  >
                    <Text style={styles.quickDateText}>{formatDisplayDate(dateVal)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="apply-custom-date-button"
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyCustomDate}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingRight: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginRight: spacing.xs + 2,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedChipText: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearText: {
    ...typography.caption,
    color: colors.accent,
    marginLeft: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dateInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickDateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.lg,
  },
  quickDateChip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  quickDateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalButton: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  cancelButton: {
    backgroundColor: colors.surfaceVariant,
  },
  cancelButtonText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  applyButtonText: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '600',
  },
});
