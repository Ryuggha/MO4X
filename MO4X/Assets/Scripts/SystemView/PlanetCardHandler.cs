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

    public void OnHidePlanetCardClick()
    {
        anim.Play("PlanetInfoDisappear");
    }

    public void disableCard()
    {
        gameObject.SetActive(false);
    }

    public void setOrbit(OrbitResponse orbit) // Change Hole Card
    {
        this.orbit = orbit;

        nameText.text = orbit.planet.name;
        energyText.text = orbit.planet.energy.ToString();
        massText.text = (orbit.planet.mass * 1000000000000000000000000f).ToString() + "Kg";
        radiusText.text = Mathf.RoundToInt(orbit.planet.radius/2).ToString() + "Km";


        if (orbit.planet.buildings.Length > 0)
        {
            technologiesButton.gameObject.SetActive(true);
            if (orbit.planet.technologies.Length <= 0) technologiesButton.enabled = false;
            else technologiesButton.enabled = true;
        }
        else
        {
            technologiesButton.gameObject.SetActive(false);
        }
    }

    public void OnTechnologiesClick()
    {
        technologiesExtraCard.SetActive(true);
        if (techList == null) techList = technologiesExtraCard.GetComponent<TechnologyList>();
        techList.setTechList(orbit.planet.technologies);
    }
}
