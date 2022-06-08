using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildingList : MonoBehaviour
{
    private string[] buildings;
    [SerializeField] private GameObject buildingCardPrefab;
    [SerializeField] private GameObject contentViewLocation;

    private List<GameObject> listOfCards;

    public void setBuildingList(string[] buildingList)
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

        buildings = buildingList;

        foreach (string s in buildings)
        {
            var aux = Instantiate(buildingCardPrefab, contentViewLocation.transform);
            listOfCards.Add(aux);
            aux.GetComponent<TechCard>().setTechName(s);
        }
    }
}
