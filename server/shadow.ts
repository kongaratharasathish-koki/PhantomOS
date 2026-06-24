export class ShadowEngine {
  /**
   * Compares agent execution result against a baseline or contract expectations.
   * In a real product, this would run a secondary LLM or deterministic rule-set.
   */
  static compare(primaryResult: any, baselineResult: any): { agreement: number; pass: boolean; divergence_reason?: string } {
    const pStr = JSON.stringify(primaryResult);
    const bStr = JSON.stringify(baselineResult);
    
    if (pStr === bStr) return { agreement: 1.0, pass: true };

    // Simple Jaccard similarity for string-based results
    const pTokens = new Set(pStr.split(/\W+/));
    const bTokens = new Set(bStr.split(/\W+/));
    const intersection = new Set([...pTokens].filter(x => bTokens.has(x)));
    const union = new Set([...pTokens, ...bTokens]);
    const agreement = intersection.size / union.size;

    const threshold = 0.85;
    const pass = agreement >= threshold;
    let divergence_reason = undefined;
    if (!pass) {
      divergence_reason = `Agent DIVERGENCE detected. Agreement: ${Math.round(agreement * 100)}%. Threshold: ${threshold * 100}%.`;
    }

    return { agreement, pass, divergence_reason };
  }
}
