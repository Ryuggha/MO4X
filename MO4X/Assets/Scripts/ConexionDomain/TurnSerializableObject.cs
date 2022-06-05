using System;
using System.Collections;
using System.Collections.Generic;

[Serializable]
public class TurnSerializableObject
{
    public string gameId;
    public string userId;
    public List<ActionInterface> actionList;

    public TurnSerializableObject(string gameId, string userId, List<ActionInterface> actionList)
    {
        this.gameId = gameId;
        this.userId = userId;
        this.actionList = actionList;
    }
}
