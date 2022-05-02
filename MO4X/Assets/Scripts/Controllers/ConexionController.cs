using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConexionController : MonoBehaviour
{
    public static ConexionController instance;

    [SerializeField] private string conexionEndPoint = "http://127.0.0.1:13756";

    [SerializeField] private string userName;
    [SerializeField] private string userId;

    private GameAccount user;

    private void Awake()
    {
        if (SceneController.instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            userId = "623cd7ef881417e8cf74610b"; //TestId
            ConexionController.instance = this;
            DontDestroyOnLoad(this);
        }
    }

    public string getConexionEndPoint()
    {
        return conexionEndPoint;
    }

    public void setUser(GameAccount user)
    {
        this.user = user;

        if (user == null)
        {
            userName = "";
            userId = "";
        }
        else
        {
            userName = user.username;
            userId = user._id;
        }
    }

    public string getUserId()
    {
        return this.userId;
    }
}
