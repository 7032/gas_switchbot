# gas_switchbot
Class_Switchbot : Define *Switchbot* class.

## How to use
1. Prepare Client ID and Secret on Switchbot App with your account.
2. Set script property as follows.

### Script Property
| *Property Name* | *Value* | 
| ---- | ---- |
| clientID | client ID to use API |
| clientSecret | client secret of the client ID |

3. Use Switchbot class in your code
```
  const  oSwitchBot  = new SwitchBot();
  const  resultVal   = oSwitchBot.getAllDevicesWithStatus();
```
