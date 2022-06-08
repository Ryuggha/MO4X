using System;

[Serializable]
public abstract class ActionInterface
{
    public int code;

    public ActionInterface(int code)
    {
        this.code = code;
    }
}

[Serializable]
public class MoveShip : ActionInterface
{
    public string shipId;
    public string targetStarId;

    public MoveShip(string shipId, string targetStarId) : base(0)
    {
        this.shipId = shipId;
        this.targetStarId = targetStarId;
    }
}

[Serializable]
public class ChangeStarName : ActionInterface
{
    public string starId;
    public string newName;

    public ChangeStarName(string starId, string newName) : base(1)
    {
        this.starId = starId;
        this.newName = newName;
    }
}

[Serializable]
public class SelectTechnology : ActionInterface
{
    public string planetId;
    public string starId;
    public string technologyName;

    public SelectTechnology(string starId, string planetId, string technologyName) : base(2)
    {
        this.starId = starId;
        this.planetId = planetId;
        this.technologyName = technologyName;
    }
}

[Serializable]
public class BuildBuilding : ActionInterface
{
    public string planetId;
    public string starId;
    public string buildingName;

    public BuildBuilding(string starId, string planetId, string buildingName) : base(3)
    {
        this.starId = starId;
        this.planetId = planetId;
        this.buildingName = buildingName;
    }
}
