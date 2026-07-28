/**
 * CouponListScreen — Browse, search, and filter coupons.
 *
 * Orchestrates hooks and components — no business logic here.
 * Uses FlashList for performant rendering, React Query for data fetching,
 * and Zustand for filter state.
 */

import React, { useCallback } from 'react';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../../theme';
import { ScreenContainer } from '../../../shared/components/ScreenContainer';
import { SearchInput } from '../../../shared/components/SearchInput';
import { ErrorView } from '../../../shared/components/ErrorView';
import { EmptyView } from '../../../shared/components/EmptyView';
import { CouponCard } from '../components/CouponCard';
import { CouponCardSkeleton } from '../components/CouponCardSkeleton';
import { FilterTabs } from '../components/FilterTabs';
import { useCoupons } from '../hooks/useCoupons';
import { useSearchCoupons } from '../hooks/useSearchCoupons';
import { useFilterStore } from '../store/useFilterStore';
import { Coupon } from '../types';
import { SKELETON_COUNT } from '../constants';
import type { CouponListScreenProps } from '../../../navigation/navigationTypes';

export function CouponListScreen({ navigation }: CouponListScreenProps) {
  const { colors, typography: typo, spacing } = useTheme();
  const { data: coupons, isLoading, isError, error, refetch, isRefetching } = useCoupons();
  const { filteredCoupons, filteredCount, isFiltering } = useSearchCoupons(coupons);
  const { searchQuery, activeFilter, setSearchQuery, setFilter } = useFilterStore();

  const handleCouponPress = useCallback(
    (coupon: Coupon) => {
      navigation.navigate('CouponDetail', { couponId: coupon.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Coupon; index: number }) => (
      <CouponCard coupon={item} onPress={handleCouponPress} index={index} />
    ),
    [handleCouponPress],
  );

  const keyExtractor = useCallback((item: Coupon) => item.id, []);

  // Loading state — skeleton placeholders
  if (isLoading) {
    return (
      <ScreenContainer>
        <Text style={[typo.h2, styles.title, { color: colors.textPrimary }]}>
          Coupons
        </Text>
        <View style={{ marginTop: spacing.base }}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <CouponCardSkeleton key={i} />
          ))}
        </View>
      </ScreenContainer>
    );
  }

  // Error state
  if (isError) {
    return (
      <ScreenContainer>
        <Text style={[typo.h2, styles.title, { color: colors.textPrimary }]}>
          Coupons
        </Text>
        <ErrorView
          message={error?.message}
          onRetry={() => refetch()}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <Text style={[typo.h2, styles.title, { color: colors.textPrimary }]}>
        Coupons
      </Text>

      {/* Search + Filters */}
      <View style={{ marginTop: spacing.base }}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-input"
        />
      </View>
      <View style={{ marginTop: spacing.md }}>
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setFilter}
          testID="filter-tabs"
        />
      </View>

      {/* Results count */}
      {isFiltering && (
        <Text
          style={[
            typo.caption,
            {
              color: colors.textTertiary,
              marginTop: spacing.sm,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {filteredCount} coupon{filteredCount !== 1 ? 's' : ''} found
        </Text>
      )}

      {/* Coupon List */}
      <View style={styles.listContainer}>
        {filteredCoupons.length === 0 ? (
          <EmptyView
            icon="search-outline"
            title="No coupons found"
            subtitle={
              isFiltering
                ? 'Try adjusting your search or filters'
                : 'No coupons available right now'
            }
            actionTitle={isFiltering ? 'Clear Filters' : undefined}
            onAction={isFiltering ? () => useFilterStore.getState().resetFilters() : undefined}
          />
        ) : (
          <FlashList
            data={filteredCoupons}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxxl }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
  },
});
