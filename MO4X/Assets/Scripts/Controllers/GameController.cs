using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameController : MonoBehaviour
{
    public static GameController instance;

    [SerializeField] private GameResponse gameView;
    [SerializeField] private StarResponse actualStar;

    private void Awake()
    {
        if (GameController.instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            GameController.instance = this;
            DontDestroyOnLoad(this);
        }
    }

   

    public void setGame(GameResponse game)
    {
        this.gameView = game;
    }

    public  GameResponse getGame()
    {
        return this.gameView;
    }

    public void setStar (StarResponse star)
    {
        this.actualStar = star;
    }

    public StarResponse getActualStar()
    {
        return this.actualStar;
    }
}
