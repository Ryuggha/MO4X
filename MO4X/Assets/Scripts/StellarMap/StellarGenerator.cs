using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class StellarGenerator : MonoBehaviour
{
    [SerializeField] private GameObject starPrefab;

    private void Start()
    {
        generateStarMap();
    }

    private void generateStarMap()
    {
        GameResponse game = GameController.instance.getGame();

        foreach (var star in game.stars)
        {
            Instantiate(starPrefab, new Vector2(star.xPos, star.yPos), Quaternion.identity);
        }
    }
}
