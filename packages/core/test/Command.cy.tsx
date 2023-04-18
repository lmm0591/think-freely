import { AddStickyCommand } from '../src/store/command';
import { CommandManager } from '../src/store/command/CommandManager';

describe('测试 Command 管理器', () => {
  it('当成功注册一个 Command 后，命令会被记录在 commands 属性里', () => {
    const commandManager = new CommandManager();
    commandManager.register('Cell', 'addSticky', AddStickyCommand);
    chai.expect(commandManager.commands['Cell/addSticky']).to.eql(AddStickyCommand);
  });
});
