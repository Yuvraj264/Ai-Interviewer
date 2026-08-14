const TAXONOMY: Record<string, { canonicalName: string; category: string }> = {
  node: { canonicalName: 'Node.js', category: 'FRAMEWORK' },
  nodejs: { canonicalName: 'Node.js', category: 'FRAMEWORK' },
  'node js': { canonicalName: 'Node.js', category: 'FRAMEWORK' },
  'node.js': { canonicalName: 'Node.js', category: 'FRAMEWORK' },
  postgres: { canonicalName: 'PostgreSQL', category: 'DATABASE' },
  postgresql: { canonicalName: 'PostgreSQL', category: 'DATABASE' },
  psql: { canonicalName: 'PostgreSQL', category: 'DATABASE' },
  react: { canonicalName: 'React', category: 'FRAMEWORK' },
  reactjs: { canonicalName: 'React', category: 'FRAMEWORK' },
  'react.js': { canonicalName: 'React', category: 'FRAMEWORK' },
  redis: { canonicalName: 'Redis', category: 'DATABASE' },
  docker: { canonicalName: 'Docker', category: 'DEVOPS' },
  kafka: { canonicalName: 'Kafka', category: 'DEVOPS' },
  aws: { canonicalName: 'AWS', category: 'CLOUD' },
  'amazon web services': { canonicalName: 'AWS', category: 'CLOUD' },
  spring: { canonicalName: 'Spring Boot', category: 'FRAMEWORK' },
  'spring boot': { canonicalName: 'Spring Boot', category: 'FRAMEWORK' },
};

export class SkillNormalizer {
  public normalizeSkill(rawSkill: string): { canonicalName: string; category: string } {
    const clean = rawSkill.trim().toLowerCase();
    if (TAXONOMY[clean]) {
      return TAXONOMY[clean];
    }
    // Capitalize first letter as fallback
    const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
    return { canonicalName: capitalized, category: 'GENERAL' };
  }
}
