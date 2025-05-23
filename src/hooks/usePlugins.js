import { useState } from 'react';
import { pluginRegistry } from '../plugins/pluginRegistry';

export const usePlugins = () => {
  const [isLoading, setIsLoading] = useState(false);

  const parseCommand = (message) => {
    if (message.startsWith('/')) {
      const [command, ...args] = message.slice(1).split(' ');
      return {
        command: command.toLowerCase(),
        args: args.join(' '),
      };
    }

    return pluginRegistry.parseNaturalLanguage(message);
  };

  const executePlugin = async (message) => {
    const parsed = parseCommand(message);
    if (!parsed) return null;

    setIsLoading(true);
    try {
      const plugin = pluginRegistry.getPlugin(parsed.command);
      
      if (!plugin) {
        return {
          type: 'text',
          content: `Unknown command: ${parsed.command}`,
        };
      }

      const result = await plugin.execute(parsed.args);
      
      return {
        type: 'plugin',
        pluginName: parsed.command,
        pluginData: result,
        content: result.summary || '',
      };
    } catch (error) {
      console.error('Plugin execution error:', error);
      return {
        type: 'text',
        content: `Error executing ${parsed.command}: ${error.message}`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailablePlugins = () => {
    return pluginRegistry.getAllPlugins().map(plugin => ({
      name: plugin.name,
      description: plugin.description
    }));
  };

  const registerPlugin = (plugin) => {
    pluginRegistry.registerPlugin(plugin);
  };

  const unregisterPlugin = (pluginName) => {
    pluginRegistry.unregisterPlugin(pluginName);
  };

  return {
    executePlugin,
    isLoading,
    getAvailablePlugins,
    registerPlugin,
    unregisterPlugin
  };
}; 