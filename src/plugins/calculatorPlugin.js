const calculatorPlugin = {
  name: 'calculator',
  description: 'Calculate mathematical expressions',

  naturalLanguagePatterns: [
    {
      regex: /(?:calculate|calc|compute|evaluate|solve)\s+(.+)/i,
      extractArgs: (message) => {
        const match = message.match(/(?:calculate|calc|compute|evaluate|solve)\s+(.+)/i);
        return match ? match[1] : message;
      }
    },
    {
      regex: /what\s+is\s+(.+)/i,
      extractArgs: (message) => {
        const match = message.match(/what\s+is\s+(.+)/i);
        const potentialMath = match ? match[1] : message;
        return /[\d+\-*/(). ]/.test(potentialMath) ? potentialMath : null;
      }
    }
  ],

  execute(expression) {
    if (!expression) {
      throw new Error('Please provide an expression to calculate');
    }

    const sanitizedExpression = expression
      .replace(/[^0-9+\-*/(). ]/g, '')
      .trim();

    if (!sanitizedExpression) {
      throw new Error('Invalid expression');
    }

    try {
      const result = Number(new Function(`return ${sanitizedExpression}`)());
      
      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Result is not a valid number');
      }

      return {
        expression: sanitizedExpression,
        result: result.toString(),
        summary: `${sanitizedExpression} = ${result}`,
      };
    } catch (error) {
      console.error('Calculator error:', error);
      throw new Error('Invalid mathematical expression');
    }
  },
};

export default calculatorPlugin; 