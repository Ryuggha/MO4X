[System.Serializable]
public class StarResponse
{
    public string _id;
    public string name;
    public float xPos;
    public float yPos;
    public string starType;
    public float mass;
    public float radius;
    public float energyEmission;
    public OrbitResponse[] orbits;
    public string owner;
}
