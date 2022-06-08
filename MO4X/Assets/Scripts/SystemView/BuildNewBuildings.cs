using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildNewBuildings : MonoBehaviour
{
    private PlanetResponse planet;
    [SerializeField] private GameObject buildingCardPrefab;
    [SerializeField] private GameObject contentViewLocation;

    private List<GameObject> listOfCards;

    public void setBuildingList(PlanetResponse planet)
    {
        if (listOfCards != null)
        {
            for (int i = 0; i < listOfCards.Count; i++)
            {
                GameObject o = listOfCards[i];
                Destroy(o);
            }
        }

        listOfCards = new List<GameObject>();

        this.planet = planet;

        for (int i = 0; i < planet.possibleBuildingNames.Length; i++)
        {
            var aux = Instantiate(buildingCardPrefab, contentViewLocation.transform);
            listOfCards.Add(aux);
            aux.GetComponent<ConstructBuildingCard>().setConstructBuildingCard(planet.energy, planet.possibleBuildingNames[i], planet.possibleBuildingEnergies[i], planet.possibleBuildingTurns[i], planet.turnsToFinishBuilding[i]);
        }
    }
}
