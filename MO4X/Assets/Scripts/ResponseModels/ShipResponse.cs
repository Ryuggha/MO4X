[System.Serializable]
public class ShipResponse
{
    public int name;
    public int type;
    public string[] modules;

    public ShipResponse(int name, int type, string[] modules)
    {
        this.name = name;
        this.type = type;
        this.modules = modules;
    }
}
