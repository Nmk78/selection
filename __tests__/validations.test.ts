import { describe, it, expect } from 'vitest';
import {
  metadataSchema,
  candidateSchema,
  secretKeySchema,
  specialSecretKeySchema,
  voteSchema,
} from '@/lib/validations';

describe('metadataSchema', () => {
  it('should validate correct metadata', () => {
    const validData = {
      title: 'Selection 2024',
      description: 'Annual selection event',
      maleForSecondRound: 5,
      femaleForSecondRound: 5,
      round: 'preview' as const,
    };

    const result = metadataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidData = {
      title: '',
      description: 'Test',
      maleForSecondRound: 5,
      femaleForSecondRound: 5,
    };

    const result = metadataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required');
    }
  });

  it('should reject less than 2 males for second round', () => {
    const invalidData = {
      title: 'Test',
      description: 'Test',
      maleForSecondRound: 1,
      femaleForSecondRound: 5,
    };

    const result = metadataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject less than 2 females for second round', () => {
    const invalidData = {
      title: 'Test',
      description: 'Test',
      maleForSecondRound: 5,
      femaleForSecondRound: 1,
    };

    const result = metadataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid round values', () => {
    const invalidData = {
      title: 'Test',
      description: 'Test',
      maleForSecondRound: 5,
      femaleForSecondRound: 5,
      round: 'invalid',
    };

    const result = metadataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept all valid round values', () => {
    const rounds = ['preview', 'first', 'second', 'result'] as const;

    rounds.forEach((round) => {
      const data = {
        title: 'Test',
        description: 'Test',
        maleForSecondRound: 5,
        femaleForSecondRound: 5,
        round,
      };

      const result = metadataSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe('candidateSchema', () => {
  const validCandidate = {
    roomId: 'room123',
    name: 'John Doe',
    intro: 'I am a candidate',
    gender: 'male' as const,
    major: 'Computer Science',
    profileImage: 'https://example.com/image.jpg',
    carouselImages: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    age: 20,
    height: 175,
    weight: 70,
    hobbies: ['reading', 'coding'],
  };

  it('should validate correct candidate data', () => {
    const result = candidateSchema.safeParse(validCandidate);
    expect(result.success).toBe(true);
  });

  it('should reject missing roomId', () => {
    const { roomId, ...invalidData } = validCandidate;
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const invalidData = { ...validCandidate, name: '' };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid gender', () => {
    const invalidData = { ...validCandidate, gender: 'other' };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid profile image URL', () => {
    const invalidData = { ...validCandidate, profileImage: 'not-a-url' };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject age below 16', () => {
    const invalidData = { ...validCandidate, age: 15 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject age above 30', () => {
    const invalidData = { ...validCandidate, age: 31 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject height below 50cm', () => {
    const invalidData = { ...validCandidate, height: 49 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject height above 250cm', () => {
    const invalidData = { ...validCandidate, height: 251 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject weight below 20kg', () => {
    const invalidData = { ...validCandidate, weight: 19 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject weight above 300kg', () => {
    const invalidData = { ...validCandidate, weight: 301 };
    const result = candidateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept female gender', () => {
    const data = { ...validCandidate, gender: 'female' as const };
    const result = candidateSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should accept optional carousel images', () => {
    const { carouselImages, ...dataWithoutCarousel } = validCandidate;
    const result = candidateSchema.safeParse(dataWithoutCarousel);
    expect(result.success).toBe(true);
  });
});

describe('secretKeySchema', () => {
  const validSecretKey = {
    adminId: 'admin123',
    roomId: 'room123',
    secretKey: 'secret123',
    firstRoundMale: true,
    firstRoundFemale: false,
    secondRoundMale: false,
    secondRoundFemale: false,
  };

  it('should validate correct secret key data', () => {
    const result = secretKeySchema.safeParse(validSecretKey);
    expect(result.success).toBe(true);
  });

  it('should reject missing adminId', () => {
    const { adminId, ...invalidData } = validSecretKey;
    const result = secretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing roomId', () => {
    const { roomId, ...invalidData } = validSecretKey;
    const result = secretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing secretKey', () => {
    const { secretKey, ...invalidData } = validSecretKey;
    const result = secretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should use default false for boolean fields', () => {
    const minimalData = {
      adminId: 'admin123',
      roomId: 'room123',
      secretKey: 'secret123',
    };
    const result = secretKeySchema.safeParse(minimalData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstRoundMale).toBe(false);
      expect(result.data.firstRoundFemale).toBe(false);
      expect(result.data.secondRoundMale).toBe(false);
      expect(result.data.secondRoundFemale).toBe(false);
    }
  });
});

describe('voteSchema', () => {
  it('should validate correct vote data', () => {
    const validVote = {
      roomid: 'room123',
      candidateId: 'candidate123',
      totalVotes: 10,
      totalRating: 50,
    };

    const result = voteSchema.safeParse(validVote);
    expect(result.success).toBe(true);
  });

  it('should reject missing candidateId', () => {
    const invalidVote = {
      roomid: 'room123',
      candidateId: '',
    };

    const result = voteSchema.safeParse(invalidVote);
    expect(result.success).toBe(false);
  });

  it('should use default values for totalVotes and totalRating', () => {
    const minimalVote = {
      roomid: 'room123',
      candidateId: 'candidate123',
    };

    const result = voteSchema.safeParse(minimalVote);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalVotes).toBe(0);
      expect(result.data.totalRating).toBe(0);
    }
  });
});

describe('specialSecretKeySchema', () => {
  const validRatings = [
    { candidateId: 'c1', rating: 5 },
    { candidateId: 'c2', rating: 6 },
    { candidateId: 'c3', rating: 7 },
    { candidateId: 'c4', rating: 8 },
    { candidateId: 'c5', rating: 9 },
    { candidateId: 'c6', rating: 10 },
  ];

  it('should validate correct special secret key with exactly 6 ratings', () => {
    const validData = {
      adminId: 'admin123',
      roomId: 'room123',
      specialSecretKey: 'special123',
      used: false,
      ratings: validRatings,
    };

    const result = specialSecretKeySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject less than 6 ratings', () => {
    const invalidData = {
      adminId: 'admin123',
      roomId: 'room123',
      specialSecretKey: 'special123',
      ratings: validRatings.slice(0, 5),
    };

    const result = specialSecretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject more than 6 ratings', () => {
    const invalidData = {
      adminId: 'admin123',
      roomId: 'room123',
      specialSecretKey: 'special123',
      ratings: [...validRatings, { candidateId: 'c7', rating: 5 }],
    };

    const result = specialSecretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject rating below 1', () => {
    const invalidData = {
      adminId: 'admin123',
      roomId: 'room123',
      specialSecretKey: 'special123',
      ratings: [
        ...validRatings.slice(0, 5),
        { candidateId: 'c6', rating: 0 },
      ],
    };

    const result = specialSecretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject rating above 10', () => {
    const invalidData = {
      adminId: 'admin123',
      roomId: 'room123',
      specialSecretKey: 'special123',
      ratings: [
        ...validRatings.slice(0, 5),
        { candidateId: 'c6', rating: 11 },
      ],
    };

    const result = specialSecretKeySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
