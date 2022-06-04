using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class TechCard : MonoBehaviour
{
    private string techName;
    private TextMeshProUGUI textField;

    private void Awake()
    {
        textField = GetComponentInChildren<TextMeshProUGUI>();
    }

    public string getTechName()
    {
        return techName;
    }
    
    public void setTechName(string name)
    {
        this.techName = name;
        textField.text = this.techName;
    }
}
