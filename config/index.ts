interface PromotionScheme {
  [key: string]: {
    required: number;
    bonus: {
      [key: string]: number;
    };
  };
}

export const promotionScheme: PromotionScheme = {
  heart: { required: 3, bonus: { heart: 1 } },
  liver: { required: 2, bonus: { lung: 1 } },
  lung: { required: 4, bonus: { liver: 1, heart: 1 } },
};

export const availableOrgans: string[] = ['heart', 'liver', 'lung'];
