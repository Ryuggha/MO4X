using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameCardController : MonoBehaviour
{
    [SerializeField] private GameObject gameNotReadyMenu;
    [SerializeField] private TextMeshProUGUI nameField;
    [SerializeField] private Image abailabilityPanel;
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
    }

    private void OnDisable()
    {
        Destroy(gameObject);
    }
}
