using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class GameCardController : MonoBehaviour
{
    [SerializeField] private TextMeshProUGUI nameField;
    [SerializeField] private Image abailabilityPanel;
    private string gameId;

    [SerializeField] private Color abailableColor;
    [SerializeField] private Color notAbailableColor;


    public void setCard(string id, string name, bool abailable)
    {
        this.gameId = id;
        this.nameField.text = name;
        if (abailable)
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

    }
}
