import { computed, unref, type MaybeRef } from "vue";
import omit from "lodash-es/omit";
import mapValues from "lodash-es/mapValues";
import mapKeys from "lodash-es/mapKeys";
import startCase from "lodash-es/startCase";

/**
 * Formats an object’s properties for UI display.
 *
 * Features:
 * - Omits unwanted keys
 * - Formats specified date fields using a custom formatter
 * - Converts keys to Start Case labels
 * - Applies a fallback for null/undefined values
 *
 * ⚠️ Dependency:
 * This composable uses **lodash-es** (tree-shakable ES module build of Lodash)
 *
 * @template T - Source object type
 * @param source - A ref or plain object to format
 * @param options - Formatting options
 * @param options.omitKeys - Keys to remove from the source object
 * @param options.dateKeys - Keys whose values should be date-formatted
 * @param options.dateFormatter - Function used to format date values
 * @param options.fallback - Fallback value for null/undefined fields (default: "N/A")
 *
 * @returns A computed object with human-readable keys and formatted values
 */
export const useFormattedProperties = <T extends Record<string, any>>(
  source: MaybeRef<T | null | undefined>,
  options?: {
    omitKeys?: (keyof T | string)[];
    dateKeys?: (keyof T | string)[];
    dateFormatter?: (value: string) => string;
    fallback?: string;
  },
) => {
  const {
    omitKeys = [],
    dateKeys = [],
    dateFormatter,
    fallback = "N/A",
  } = options || {};

  return computed<Record<string, unknown>>(() => {
    const value = unref(source);
    if (!value) return {};

    const omitted = omit(value, omitKeys as string[]);

    const formattedValues = mapValues(omitted, (v, key) =>
      dateKeys.includes(key) && v && dateFormatter
        ? dateFormatter(String(v))
        : (v ?? fallback),
    );

    return mapKeys(formattedValues, (_, key) => startCase(key));
  });
};
