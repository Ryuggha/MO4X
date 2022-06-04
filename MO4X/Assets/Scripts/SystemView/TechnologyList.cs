using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TechnologyList : MonoBehaviour
{
    private string[] technologies;
    [SerializeField] private GameObject techCardPrefab;
    [SerializeField] private GameObject contentViewLocation;

    private List<GameObject> listOfCards;

    public void setTechList(string[] techList)
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

        technologies = techList;

        foreach (string s in technologies)
        {
            var aux = Instantiate(techCardPrefab, contentViewLocation.transform);
            listOfCards.Add(aux);
            aux.GetComponent<TechCard>().setTechName(s);
        }
    }
}
