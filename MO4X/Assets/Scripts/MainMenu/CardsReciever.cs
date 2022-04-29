using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CardsReciever : MonoBehaviour
{
    [SerializeField] private GameObject cardPrefab;

    public void reciveCards()
    {
        WWWForm form = new WWWForm();

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/getGames", form);
        UnityWebRequestAsyncOperation requestHandler = request.SendWebRequest();
    }
}
