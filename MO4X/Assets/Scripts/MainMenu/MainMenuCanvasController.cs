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
    [SerializeField] private GameObject joinGameMenu;

    [Header("Create Game Objects")]
    [SerializeField] private Button createGameButton;
    [SerializeField] private Button reloadButton;
    [SerializeField] private TextMeshProUGUI createGameHelperText;
    [SerializeField] private TMP_InputField numberOfPlayersField;
    [SerializeField] private TMP_InputField gameNameFeild;
    [SerializeField] private GameObject copyCodeButton;
    [SerializeField] private TextMeshProUGUI inviteCodeText;
    private string inviteCode;

    [Header("Join Game Objects")]
    [SerializeField] private Button joinGameButton;
    [SerializeField] private TextMeshProUGUI joinGameHelperText;
    [SerializeField] private TMP_InputField inviteCodeField;

    private TextEditor textEditor;

    
    private void Start()
    {
        textEditor = new TextEditor();
    }

    public void OnCreateGameMenuClick()
    {
        mainButtons.SetActive(false);
        createGame.SetActive(true);
    }

    public void OnShowCurrentGamesClick()
    {
        gameOnCourseCards.SetActive(true);
        mainButtons.SetActive(false);
    }

    public void OnJoinMenuClick()
    {
        mainButtons.SetActive(false);
        joinGameMenu.SetActive(true);

    }

    public void OnBackToMainMenuClick()
    {
        mainButtons.SetActive(true);
        gameOnCourseCards.SetActive(false);
        createGame.SetActive(false);
        joinGameMenu.SetActive(false);

        foreach (GameNotReadyMenu menu in FindObjectsOfType<GameNotReadyMenu>())
        {
            menu.OnBackClick();
        }

        //JoinGame Default Settings
        joinGameButton.interactable = true;
        joinGameHelperText.text = "Write an invite code to join a game";
        inviteCodeField.text = "";

        //CreateGame Default Settings
        createGameButton.interactable = true;
        createGameHelperText.text = "Create Game";
        numberOfPlayersField.text = "";
        gameNameFeild.text = "";
        copyCodeButton.SetActive(false);
        inviteCodeText.text = "";
        inviteCode = "";
    }

    public void OnReloadGameCardsClick()
    {
        reloadButton.enabled = false;
        OnBackToMainMenuClick();
        OnShowCurrentGamesClick();
    }

    public void reenableReloadButton()
    {
        reloadButton.enabled = true;
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
        form.AddField("userId", ConexionController.instance.getUserId());

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/createGame", form);
        UnityWebRequestAsyncOperation requestHandler = request.SendWebRequest();
               
        float timeLeft = 60f;
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
                this.inviteCode = response.inviteCode;
                createGameHelperText.text = "Game Succesfully Created";
                inviteCodeText.text = "Invite code: " + inviteCode;
                copyCodeButton.SetActive(true);
            }
            else if (response.code == 1)
            {
                createGameHelperText.text = "Unknown Error";
                createGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 2)
            {
                createGameHelperText.text = response.msg;
                createGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 3)
            {
                createGameHelperText.text = response.msg;
                createGameButton.interactable = true;
                Debug.Log(response.msg);
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

    public void OnCopyToClipboardClick()
    {
        textEditor.text = inviteCode;
        textEditor.SelectAll();
        textEditor.Copy();
    }

    public void OnPasteFromClipboardClick()
    {
        textEditor.text = "";
        textEditor.Paste();
        inviteCodeField.text = textEditor.text;
    }

    public void OnJoinClick()
    {
        joinGameButton.interactable = false;
        joinGameHelperText.text = "Joining Game...";
        StartCoroutine(TryJoinGame());
    }

    public IEnumerator TryJoinGame()
    {
        string code = inviteCodeField.text.Trim();

        WWWForm form = new WWWForm();
        form.AddField("inviteCode", code);
        form.AddField("userId", ConexionController.instance.getUserId());

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/joinGame", form);
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
            JoinGameResponse response = JsonUtility.FromJson<JoinGameResponse>(request.downloadHandler.text);
            if (response.code == 0)
            {
                joinGameHelperText.text = "You have joined the game: " + response.gameName;
            }
            else if (response.code == 1)
            {
                joinGameHelperText.text = "Unexpected Client Error";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 2)
            {
                joinGameHelperText.text = "Not games found for the given code";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 3)
            {
                joinGameHelperText.text = "That game is already full";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 4) 
            {
                joinGameHelperText.text = "Unexpected Error: User not found";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else if (response.code == 5)
            {
                joinGameHelperText.text = "You already are in that game";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
            else
            {
                joinGameHelperText.text = "Unknown Error";
                joinGameButton.interactable = true;
                Debug.Log(response.msg);
            }
        }
        else
        {
            joinGameHelperText.text = "Unable to connect to the server...";
            joinGameButton.interactable = true;
        }


        yield return null;
    }

    public void OnLogOutClick()
    {
        ConexionController.instance.setUser(null);
        SceneController.instance.changeScene("LogInScreen");
    }

    public IEnumerator TryLeaveGame(string gameId, Button button)
    {
        WWWForm form = new WWWForm();
        form.AddField("gameId", gameId);
        form.AddField("userId", ConexionController.instance.getUserId());

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/leaveGame", form);
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
            LeaveGameResponse response = JsonUtility.FromJson<LeaveGameResponse>(request.downloadHandler.text);
            if (response.code == 0)
            {
                OnBackToMainMenuClick();
            }
            else if (response.code == 1)
            {
                Debug.Log(response.msg);
                button.interactable = true;
            }
            else if (response.code == 2)
            {
                Debug.Log(response.msg);
                button.interactable = true;
            }
            else if (response.code == 3)
            {
                Debug.Log(response.msg);
                button.interactable = true;
            }
            else
            {
                Debug.Log(response.msg);
                button.interactable = true;
            }
        }
        else
        {
            Debug.Log("Unable to connect to the server...");
            button.interactable = true;
        }

        yield return null;
    }
}
