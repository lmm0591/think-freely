import type { CellActions } from '../..';
import { Command } from './Command';

export class CommandManager {
  commands: Record<string, Command> = {};
  register(nameSpace: string, commandName: keyof typeof CellActions, command: Command) {
    this.commands[`${nameSpace}/${commandName}`] = command;
  }
}
export const commandManager = new CommandManager();
