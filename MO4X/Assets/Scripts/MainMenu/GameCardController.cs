using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using UnityEngine.Networking;

public class GameCardController : MonoBehaviour
{
    [SerializeField] private GameObject gameNotReadyMenu;
    [SerializeField] private TextMeshProUGUI nameField;
    [SerializeField] private Image abailabilityPanel;
    [SerializeField] private Button playButton;
    private string gameId;
    private GameResponse game;
    private MainMenuCanvasController canvasController;

    [SerializeField] private Color abailableColor;
    [SerializeField] private Color notAbailableColor;


    public void setCard(GameResponse game, MainMenuCanvasController canvasController)
    {
        this.game = game;
        this.nameField.text = game.name;
        this.canvasController = canvasController;
        if (true)
        {
            abailabilityPanel.color = abailableColor;
        }
        else
        {
            abailabilityPanel.color = notAbailableColor;
        }
    }

    public string getId()
    {
        return this.gameId;
    }

    public void onPlayGameClick()
    {
        if (game.actualTurn < 0)
        {
            GameNotReadyMenu gnrm = Instantiate(gameNotReadyMenu, canvasController.transform).GetComponent<GameNotReadyMenu>();
            gnrm.initialize(game._id, game.numberOfPlayers, game.inviteCode, game.users, canvasController);
        }
        else
        {
            playButton.interactable = false;
            StartCoroutine(TryLoadGame());
        }
    }

    private void OnDisable()
    {
        Destroy(gameObject);
    }

    public IEnumerator TryLoadGame()
    {
        WWWForm form = new WWWForm();
        form.AddField("userId", ConexionController.instance.getUserId());
        form.AddField("gameId", game._id);

        UnityWebRequest request = UnityWebRequest.Post(ConexionController.instance.getConexionEndPoint() + "/loadGame", form);
        UnityWebRequestAsyncOperation requestHandler = request.SendWebRequest();

        float timeLeft = 180f;
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
            LoadGameResponse response = JsonUtility.FromJson<LoadGameResponse>(request.downloadHandler.text);
            if (response.code == 0)
            {
                GameController.instance.setGame(response.game);
                SceneController.instance.changeScene("StellarMap");
            }
            else if (response.code == 1)
            {
                Debug.Log(response.msg);
                playButton.interactable = true;
            }
            else if (response.code == 2)
            {
                Debug.Log(response.msg);
                playButton.interactable = true;
            }
            else if (response.code == 3)
            {
                Debug.Log(response.msg);
                playButton.interactable = true;
            }
            else
            {
                Debug.Log(response.msg);
                playButton.interactable = true;
            }
        }
        else
        {
            Debug.Log("Unable to connect to the server...");
            playButton.interactable = true;
        }

        yield return null;
    }
}
