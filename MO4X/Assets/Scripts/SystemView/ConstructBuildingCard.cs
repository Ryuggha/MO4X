using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class ConstructBuildingCard : MonoBehaviour
{
    private string buildingName;
    private int energyRequired;
    private int turnsLong;
    [SerializeField] private TextMeshProUGUI nameField;
    [SerializeField] private TextMeshProUGUI energyField;
    [SerializeField] private TextMeshProUGUI turnsField;
    [SerializeField] private TextMeshProUGUI turnsLeftField;
    [SerializeField] private Button constructButton;
    [SerializeField] private Image[] borders;
    [SerializeField] private Color neutralColor;
    [SerializeField] private Color constructingColor;


    public string getTechName()
    {
        return buildingName;
    }

    public void setConstructBuildingCard(int actualEnergy, string buildingName, int energyRequired, int turnsLong, int turnsToComplete)
    {
        this.energyRequired = energyRequired;
        this.buildingName = buildingName;
        this.turnsLong = turnsLong;
        nameField.text = buildingName;
        energyField.text = "Energy: " + energyRequired.ToString();
        turnsField.text = $"{turnsLong} Turns";

        if (turnsToComplete == -1)
        {
            constructButton.gameObject.SetActive(true);
            turnsLeftField.gameObject.SetActive(false);
            if (actualEnergy >= energyRequired)
            {
                constructButton.enabled = true;
            }
            else constructButton.enabled = false;

            foreach (var i in borders) i.color = neutralColor;
        }
        else
        {
            constructButton.gameObject.SetActive(false);
            turnsLeftField.gameObject.SetActive(true);
            turnsLeftField.text = turnsToComplete.ToString();

            foreach (var i in borders) i.color = constructingColor;
        }
    }

    public void OnConstructButtonClick()
    {
        var planetCard = FindObjectOfType<PlanetCardHandler>();

        if (TurnHandler.instance.buildBuilding(GameController.instance.getActualStar(), planetCard.getOrbit().planet, buildingName, energyRequired))
        {
            
            planetCard.spendEnergy(energyRequired);
            constructButton.gameObject.SetActive(false);
            turnsLeftField.gameObject.SetActive(true);
            turnsLeftField.text = turnsLong.ToString();

            foreach (var i in borders) i.color = constructingColor;
        }
        
    }
}
