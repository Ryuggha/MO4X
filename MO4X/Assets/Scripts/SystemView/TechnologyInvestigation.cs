using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class TechnologyInvestigation : MonoBehaviour
{
    private PlanetResponse planet;

    [Header("On Course")]
    [SerializeField] private GameObject investigationOnCourseObject;
    [SerializeField] private TechCard onCourseCard;
    [SerializeField] private TextMeshProUGUI textOnCourse;

    [Header("Selection")]
    [SerializeField] private GameObject investigationSelectionObject;
    [SerializeField] private TechCard[] investigationCards;
    [SerializeField] private TextMeshProUGUI[] investigationText;

    public void setPlanet(PlanetResponse planet)
    {
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
}
