using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class PlanetCardHandler : MonoBehaviour
{
    public static PlanetCardHandler instance;
    private Animator anim;

    [SerializeField] private TextMeshProUGUI nameText;
    [SerializeField] private TextMeshProUGUI energyText;
    [SerializeField] private TextMeshProUGUI massText;
    [SerializeField] private TextMeshProUGUI radiusText;
    [SerializeField] private Button technologiesButton;
    [SerializeField] private GameObject technologiesExtraCard;
    private TechnologyList techList;
    [SerializeField] private Button investigationButton;
    [SerializeField] private GameObject technologyInvestigationExtraCard;
    private TechnologyInvestigation techInvestigation;
    [SerializeField] private Button buildingListButton;
    [SerializeField] private GameObject buildingListExtraCard;
    private BuildingList buildingList;
    [SerializeField] private Button createBuildingListButton;
    [SerializeField] private GameObject createBuildingListExtraCard;
    private BuildNewBuildings createBuildingList;


    private StarResponse star;
    private OrbitResponse orbit;

    private void Awake()
    {
        if (instance != null)
        {
            Destroy(this);
        }
        else
        {
            instance = this;
        }
        anim = GetComponent<Animator>();
    }

    private void OnDestroy()
    {
        instance = null;
    }

    private void OnEnable()
    {
        anim.Play("PlanetInfoAppear");
    }

    public OrbitResponse getOrbit()
    {
        return this.orbit;
    }

    public bool spendEnergy(int ammount)
    {
        if (orbit.planet.energy >= ammount)
        {
            orbit.planet.energy -= ammount;
            energyText.text = orbit.planet.energy.ToString();
            return true;
        }
        return false;
    }

    public void OnHidePlanetCardClick()
    {
        anim.Play("PlanetInfoDisappear");
    }

    public void disableCard()
    {
        gameObject.SetActive(false);
    }

    public void setOrbit(StarResponse star, OrbitResponse orbit) // Change Hole Card
    {
        this.star = star;
        this.orbit = orbit;

        nameText.text = orbit.planet.name;
        energyText.text = orbit.planet.energy.ToString();
        massText.text = (orbit.planet.mass * 1000000000000000000000000f).ToString() + "Kg";
        radiusText.text = Mathf.RoundToInt(orbit.planet.radius/2).ToString() + "Km";


        if (orbit.planet.buildings.Length > 0)
        {
            technologiesButton.gameObject.SetActive(true);
            investigationButton.gameObject.SetActive(true);
            buildingListButton.gameObject.SetActive(true);
            createBuildingListButton.gameObject.SetActive(true);

            if (orbit.planet.technologies.Length <= 0)
            {
                technologiesButton.interactable = false;
                investigationButton.interactable = false;
            }
            else
            {
                technologiesButton.interactable = true;
                investigationButton.interactable = true;
            }

            buildingListButton.interactable = true;

            if (orbit.planet.possibleBuildingNames.Length > 0) createBuildingListButton.interactable = true;
            else createBuildingListButton.interactable = false;
        }
        else
        {
            technologiesButton.gameObject.SetActive(false);
            investigationButton.gameObject.SetActive(false);
            buildingListButton.gameObject.SetActive(false);
            createBuildingListButton.gameObject.SetActive(false);
        }
    }

    public void OnTechnologiesClick()
    {
        technologiesExtraCard.SetActive(true);
        if (techList == null) techList = technologiesExtraCard.GetComponent<TechnologyList>();
        techList.setTechList(orbit.planet.technologies);
    }

    public void OnTechnologyInvestigationClick()
    {
        technologyInvestigationExtraCard.SetActive(true);
        if (techInvestigation == null) techInvestigation = technologyInvestigationExtraCard.GetComponent<TechnologyInvestigation>();
        techInvestigation.setPlanet(orbit, star);
    }

    public void OnBuildingListClick()
    {
        buildingListExtraCard.SetActive(true);
        if (buildingList == null) buildingList = buildingListExtraCard.GetComponent<BuildingList>();
        buildingList.setBuildingList(orbit.planet.buildings);
    }

    public void OnCreateBuildingClick()
    {
        createBuildingListExtraCard.SetActive(true);
        if (createBuildingList == null) createBuildingList = createBuildingListExtraCard.GetComponent<BuildNewBuildings>();
        createBuildingList.setBuildingList(orbit.planet);
    }
}
