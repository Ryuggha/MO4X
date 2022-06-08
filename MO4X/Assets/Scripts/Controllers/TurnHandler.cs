using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class TurnHandler : MonoBehaviour
{
    private List<ActionInterface> actionList;

    private bool turnEnded;

    public static TurnHandler instance;

    private void Awake()
    {
        if (TurnHandler.instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            TurnHandler.instance = this;
            DontDestroyOnLoad(this);
        }

        if (actionList == null) actionList = new List<ActionInterface>();
    }

    public void loadGame()
    {
        actionList = new List<ActionInterface>();
    }

    public void endTurn()
    {
        if (GameController.instance.getGame().turnCanBePlayed)
        {
            StartCoroutine(TryEndTurn());
        }
        
    }

    public void setTurnEnded (bool turnEnded)
    {
        this.turnEnded = turnEnded;
    }
    
    public bool getTurnEnded ()
    {
        return this.turnEnded;
    }

    public bool changeStarName(StarResponse star, string newName)
    {
        for (int i = actionList.Count - 1; i >= 0; i--)
        {
            if (actionList[i].code == 1)
            {
                var actionChildObject = (ChangeStarName)actionList[i];
                if (actionChildObject.starId == star._id) actionList.RemoveAt(i);
            }
        }
        actionList.Add(new ChangeStarName(star._id, newName));
        star.name = newName;
        return true;
    }

    public bool selectTechnology(StarResponse star, PlanetResponse planet, int techIndex)
    {
        for (int i = actionList.Count - 1; i >= 0; i--)
        {
            if (actionList[i].code == 2)
            {
                var actionChildObject = (SelectTechnology)actionList[i];
                if (actionChildObject.planetId == planet._id) actionList.RemoveAt(i);
            }
        }

        if (planet.investigationTechnologies[techIndex] == "") return false;
        actionList.Add(new SelectTechnology(star._id, planet._id, planet.investigationTechnologies[techIndex]));
        return true;
    }

    public bool buildBuilding(StarResponse star, PlanetResponse planet, string buildingName, int energyRequired)
    {
        if (planet.energy < energyRequired) return false;
        actionList.Add(new BuildBuilding(star._id, planet._id, buildingName));

        return true;

    }

    public IEnumerator TryEndTurn()
    {

        WWWForm form = new WWWForm();
        form.AddField("actionList", JSONParse(generateSerializableObject()));

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/endTurn", form);
        UnityWebRequestAsyncOperation requestHandler = request.SendWebRequest();

        float timeLeft = 10f;
        while (!requestHandler.isDone)
        {
            timeLeft -= Time.deltaTime;

            if (timeLeft < 0)
            {
                break;
            }

            yield return null;
        }

        if (request.result == UnityWebRequest.Result.Success)
        {

        }
        else
        {
            Debug.Log("Unable to connect to the server...");
        }

        yield return null;
    }

    private TurnSerializableObject generateSerializableObject()
    {
        return new TurnSerializableObject(GameController.instance.getGame()._id, ConexionController.instance.getUserId(), actionList);
    }

    public static string JSONParse(object o)
    {
        return Newtonsoft.Json.JsonConvert.SerializeObject(o);
    }
}



