using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class SystemGenerator : MonoBehaviour
{
    [SerializeField] private float rotationVelocity = 1;

    [Header("UIElements")]
    [SerializeField] private TextMeshProUGUI nameUI;
    [SerializeField] private TextMeshProUGUI massUI;
    [SerializeField] private TextMeshProUGUI luminosityUI;

    [Header("Prefabs")]
    [SerializeField] private GameObject orbitPrefab;
    [SerializeField] private List<GameObject> terrestrialPlanets;
    [SerializeField] private List<GameObject> gasPlanets;

    private StarResponse star;

    private void Start()
    {
        star = GameController.instance.getActualStar();

        if (star != null && star.name != "") createStarSystem();
    }

    private void createStarSystem()
    {
        nameUI.text = star.name;
        massUI.text = star.mass.ToString("0.###");
        luminosityUI.text = star.energyEmission.ToString("0.###");

        float rotationFactor = rotationVelocity * Random.Range(0.9f, 1.1f); 

        foreach (var orbit in star.orbits)
        {
            if (orbit.planet != null && orbit.planet.name != null && orbit.planet.name != "")
            {
                var orbitObject = Instantiate(orbitPrefab, transform);
                GameObject auxPrefab;

                if (orbit.planet.planetType == "terrestrial")
                {
                    auxPrefab = terrestrialPlanets[Random.Range(0, terrestrialPlanets.Count)];
                }
                else
                {
                    auxPrefab = gasPlanets[Random.Range(0, gasPlanets.Count)];
                }

                var planetObject = Instantiate(auxPrefab, orbitObject.transform);
                float planetOffset = 5f + ((orbit.index * (13f / star.orbits.Length)) + ((13f / star.orbits.Length) / 2f));
                planetObject.transform.localPosition = new Vector3(planetOffset, 0, 0);
                orbitObject.transform.rotation = Quaternion.Euler(0, Random.Range(0f, 360f), 0);
                var orbitCreator = orbitObject.GetComponent<Orbit>();
                orbitCreator.rotationSpeed = (1 - (planetOffset / 18)) * rotationVelocity;
                orbitCreator.radius = planetOffset;
                orbitCreator.drawOrbit();
            }
        }
    }

    public void OnBackClick()
    {
        SceneController.instance.changeScene("StellarMap");
    }
}
