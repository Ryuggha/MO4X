[System.Serializable]
public class PlanetResponse
{
    public string _id;
    public string name;
    public string planetType;
    public float mass;
    public float radius;
    public int energy;
    public string[] buildings;
    public string[] technologies;
    public string[] investigationTechnologies;
    public string[] investigationTechnologiesDescription;
    public string technologyBeingInvestigated;
    public float turnsToFinishInvestigation;
}
