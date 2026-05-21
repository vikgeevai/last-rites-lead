/** Source configuration registry.
 *  Add a new entry here whenever a new quiz / website integration is added.
 *  metadataColumns defines which metadata keys get their own table columns
 *  when that source is selected in the Leads view.
 */
export interface SourceConfig {
  label: string;
  color: string;
  metadataColumns: Array<{ key: string; label: string }>;
}

export const SOURCE_CONFIGS: Record<string, SourceConfig> = {
  fundwise: {
    label: "FundWise",
    color: "#2D6A34",
    metadataColumns: [
      { key: "financing_purpose",  label: "Purpose"       },
      { key: "loan_amount",        label: "Loan Amount"   },
      { key: "annual_revenue",     label: "Annual Revenue"},
      { key: "operating_time",     label: "Time in Biz"   },
      { key: "business_type",      label: "Biz Type"      },
      { key: "industry",           label: "Industry"      },
      { key: "prior_applications", label: "Prior Apps"    },
    ],
  },
  "instagram-ads": {
    label: "Instagram Ads",
    color: "#E1306C",
    metadataColumns: [],
  },
  "meta-ads": {
    label: "Meta Ads",
    color: "#1877F2",
    metadataColumns: [],
  },
  website: {
    label: "Website",
    color: "#2563EB",
    metadataColumns: [],
  },
};

/** Returns config for a source, with a sensible fallback for unknown sources. */
export function getSourceConfig(source: string): SourceConfig {
  return (
    SOURCE_CONFIGS[source] ?? {
      label: source ?? "Unknown",
      color: "#6b7280",
      metadataColumns: [],
    }
  );
}
