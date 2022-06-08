using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class TechnologyInvestigation : MonoBehaviour
{
    private StarResponse star;
    private OrbitResponse orbit;

    [SerializeField] private Color neutralColor;
    [SerializeField] private Color selectedColor;

    [Header("On Course")]
    [SerializeField] private GameObject investigationOnCourseObject;
    [SerializeField] private TechCard onCourseCard;
    [SerializeField] private TextMeshProUGUI textOnCourse;

    [Header("Selection")]
    [SerializeField] private GameObject investigationSelectionObject;
    [SerializeField] private TechCard[] investigationCards;
    [SerializeField] private TextMeshProUGUI[] investigationText;
    [SerializeField] private Image[] borders;

    public void setPlanet(OrbitResponse orbit, StarResponse star)
    {
        this.star = star;
        this.orbit = orbit;
        PlanetResponse planet = orbit.planet;

        if (planet.technologyBeingInvestigated != "")
        {
            investigationOnCourseObject.SetActive(true);
            investigationSelectionObject.SetActive(false);

            onCourseCard.setTechName(planet.technologyBeingInvestigated);
            textOnCourse.text = planet.turnsToFinishInvestigation.ToString() + " turns to end Investigation.";
        }
        else
        {
            investigationOnCourseObject.SetActive(false);
            investigationSelectionObject.SetActive(true);

            for (int i = 0; i < investigationCards.Length; i++)
            {
                investigationCards[i].setTechName(planet.investigationTechnologies[i]);
                investigationText[i].text = planet.investigationTechnologiesDescription[i];
            }
        }
    }

    public void OnPressFirstTech()
    {
        selectTech(0);
    }

    public void OnPressSecondTech()
    {
        selectTech(1);
    }

    public void OnPressThirdTech()
    {
        selectTech(2);
    }

    private void selectTech(int techIndex)
    {
        for (int i = 0; i < 3; i++)
        {
            if (i == techIndex && TurnHandler.instance.selectTechnology(star, orbit.planet, techIndex)) borders[i].color = selectedColor;
            else borders[i].color = neutralColor;
        }
    }
}
