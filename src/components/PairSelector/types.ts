export interface ITradingPair {
  id: string;
  label: string;
  leverage: string;
}

export type IPairSelectorProps = {
  pairs: ITradingPair[];
  selectedPairId: string;
  onChange: (id: string) => void;
};
