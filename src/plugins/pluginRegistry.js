import weatherPlugin from './weatherPlugin';
import calculatorPlugin from './calculatorPlugin';
import dictionaryPlugin from './dictionaryPlugin';

class PluginRegistry {
  constructor() {
    this.plugins = new Map();
    this.naturalLanguagePatterns = new Map();
    
    this.registerPlugin(weatherPlugin);
    this.registerPlugin(calculatorPlugin);
    this.registerPlugin(dictionaryPlugin);
  }

  registerPlugin(plugin) {
    if (!plugin.name || !plugin.execute) {
      throw new Error('Invalid plugin format');
    }

    this.plugins.set(plugin.name, plugin);
    
    if (plugin.naturalLanguagePatterns) {
      this.naturalLanguagePatterns.set(
        plugin.name,
        plugin.naturalLanguagePatterns
      );
    }
  }

  unregisterPlugin(pluginName) {
    this.plugins.delete(pluginName);
    this.naturalLanguagePatterns.delete(pluginName);
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  parseNaturalLanguage(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [pluginName, patterns] of this.naturalLanguagePatterns) {
      for (const pattern of patterns) {
        if (lowerMessage.match(pattern.regex)) {
          const args = pattern.extractArgs ? pattern.extractArgs(lowerMessage) : lowerMessage;
          return {
            command: pluginName,
            args: args.trim()
          };
        }
      }
    }

    return null;
  }
}

export const pluginRegistry = new PluginRegistry(); 