using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CardsReciever : MonoBehaviour
{
    [SerializeField] private GameObject cardPrefab;
    private MainMenuCanvasController canvasController;

    private void Start()
    {
        canvasController = GetComponentInParent<MainMenuCanvasController>();
    }

    private void OnEnable()
    {
        StartCoroutine(reciveCards());
    }

    public IEnumerator reciveCards()
    {
        WWWForm form = new WWWForm();
        form.AddField("userId", ConexionController.instance.getUserId());

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/getGames", form);
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
            GameListResponse response = JsonUtility.FromJson<GameListResponse>(request.downloadHandler.text);
            if (response.code == 0)
            {
                foreach (GameResponse game in response.games)
                {
                    GameCardController controller = Instantiate(cardPrefab, transform).GetComponent<GameCardController>();

                    controller.setCard(game, canvasController);
                }
            }
            else if (response.code == 1)
            {
                Debug.Log(response.msg);
                canvasController.OnBackToMainMenuClick();
            }
            else if (response.code == 2)
            {
                Debug.Log(response.msg);
                canvasController.OnBackToMainMenuClick();
            }
            else
            {
                Debug.Log(response.msg);
                canvasController.OnBackToMainMenuClick();
            }
        }
        else
        {
            Debug.Log("Unable to connect to the server...");
            canvasController.OnBackToMainMenuClick();
        }

        yield return null;
    }
}
