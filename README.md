# Frites N Meats Slack Integration

| Command                                                    | Description                                                                                        | Example                                        
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------
| /fritesnmeats [addOrder] [order]                           | Register an order                                                                                  | `/fritesnmeats addOrder burger of the day`
| /fritesnmeats [order]                                      | Will submit an order based on what you added above                                                 | `/fritesnmeats order`     
| /fritesnmeats :hamburger:                                  | Same as [order]                                                                                    | /fritesnmeats :hamburger:
| /fritesnmeats [alias] [unique alias]                       | Registers an alias to make an order with your alias name instead of your slack prefixed user name  | `/fritenmeats alias marwan`                               
| /fritesnmeats [what]                                       | returns your registered order, in case you forgot it                                               | `/fritenmeats what`                               
| /fritesnmeats [BOTW]                                       | Sends back burger of the week.                                                                     | /fritenmeats BOTW                                
