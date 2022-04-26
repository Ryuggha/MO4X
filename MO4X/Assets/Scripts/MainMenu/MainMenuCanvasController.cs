using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using TMPro;
using UnityEngine.Networking;

public class MainMenuCanvasController : MonoBehaviour
{
    [SerializeField] private GameObject mainButtons;
    [SerializeField] private GameObject gameOnCourseCards;
    [SerializeField] private GameObject createGame;

    [Header("Create Game Objects")]
    [SerializeField] private Button createGameButton;
    [SerializeField] private TextMeshProUGUI createGameHelperText;
    [SerializeField] private TMP_InputField numberOfPlayersField;
    [SerializeField] private TMP_InputField gameNameFeild;

    public void OnCreateGameMenuClick()
    {
        mainButtons.SetActive(false);
        createGame.SetActive(true);
    }

    public void OnShowCurrentGamesClick()
    {
        mainButtons.SetActive(false);
        gameOnCourseCards.SetActive(true);
    }

    public void OnBackToMainMenuClick()
    {
        mainButtons.SetActive(true);
        gameOnCourseCards.SetActive(false);
        createGame.SetActive(false);
    }

    public void OnCreateGameClick()
    {
        createGameButton.interactable = false;
        createGameHelperText.text = "Creating Game...";
        StartCoroutine(TryCreateAGame());
    }

    private IEnumerator TryCreateAGame()
    {
        string gameNameString = gameNameFeild.text;
        string numberOfPlayersString = numberOfPlayersField.text;

        WWWForm form = new WWWForm();
        form.AddField("name", gameNameString);
        form.AddField("numberOfPlayers", numberOfPlayersString);
        form.AddField("users", ConexionController.instance.getUserId());

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/createGame", form);
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
            CreateGameResponse response = JsonUtility.FromJson<CreateGameResponse>(request.downloadHandler.text);
            if (response.code == 0)
            {
                createGameHelperText.text = "Nice\n Invite code: " + response.inviteCode;
            }
            else
            {
                createGameHelperText.text = "Unknown Error";
                createGameButton.interactable = true;
                Debug.Log(response.msg);
            }
        }
        else
        {
            createGameHelperText.text = "Unable to connect to the server...";
            createGameButton.interactable = true;
        }

        yield return null;
    }
}
