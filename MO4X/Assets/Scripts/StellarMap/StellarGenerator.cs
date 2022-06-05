using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class StellarGenerator : MonoBehaviour
{
    [SerializeField] private GameObject starPrefab;
    [SerializeField] private GameObject UIStarHelper;
    [SerializeField] private Material allyColor;
    [SerializeField] private Material enemyColor;
    [SerializeField] private Material fightColor;

    [SerializeField] private Button endTurnButton;
    [SerializeField] private GameObject endTurnConfirmationObject;


    private void Start()
    {
        generateStarMap();
    }

    private void generateStarMap()
    {
        GameResponse game = GameController.instance.getGame();
        if (game.turnCanBePlayed) endTurnButton.interactable = true;
        else endTurnButton.interactable = false;

        foreach (var star in game.stars)
        {
            GameObject o = Instantiate(starPrefab, new Vector2(star.xPos, star.yPos), Quaternion.identity);
            o.transform.parent = transform;
            o.name = star.name;
            o.GetComponent<StarCollider>().setStar(star, true);

            if (star.owner != "")
            {
                var uiHelper = Instantiate(UIStarHelper, o.transform);
                if (star.owner == ConexionController.instance.getUsername())
                {
                    uiHelper.GetComponent<MeshRenderer>().material = allyColor;
                }
                else if (star.owner != ConexionController.instance.getUsername())
                {
                    uiHelper.GetComponent<MeshRenderer>().material = enemyColor;
                }
            }
        }
    }

    public void back()
    {
        GameController.instance.setStar(null);
        SceneController.instance.changeScene("MainMenu");
    }

    public void OnEndTurnClick()
    {
        endTurnConfirmationObject.SetActive(true);
    }

    public void OnEndTurnConfirmation()
    {
        TurnHandler.instance.endTurn();
        SceneController.instance.changeScene("MainMenu");
        endTurnConfirmationObject.SetActive(false);
    }

    public void OnEndTurnDenegation()
    {
        endTurnConfirmationObject.SetActive(false);
    }
}
